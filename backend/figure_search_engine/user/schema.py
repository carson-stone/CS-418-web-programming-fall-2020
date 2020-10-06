from django.contrib.auth import get_user_model

import graphene
from graphene_django import DjangoObjectType


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        email = graphene.String(required=True)
        phone = graphene.String(required=-True)
        password = graphene.String(required=True)
        interest = graphene.String(required=True)

    def mutate(self, info, email, phone, password, interest):
        user = get_user_model()(
            email=email, username=email, phone=phone, interest=interest
        )

        user.set_password(password)
        user.save()

        return CreateUser(user=user)


class UpdateProfile(graphene.Mutation):
    phone = graphene.String()
    interest = graphene.String()

    class Arguments:
        phone = graphene.String(required=True)
        interest = graphene.String(required=True)

    def mutate(self, info, phone, interest):
        user = info.context.user

        user.phone = phone
        user.interest = interest

        user.save()

        return UpdateProfile(phone=phone, interest=interest)


class ChangePassword(graphene.Mutation):
    email = graphene.String()

    class Arguments:
        password = graphene.String()

    def mutate(self, info, password):
        user = info.context.user
        user.set_password(password)
        user.save()

        return ChangePassword(email=user.email)


class RecoverPassword(graphene.Mutation):
    email = graphene.String()

    class Arguments:
        email = graphene.String()
        password = graphene.String()

    def mutate(self, info, email, password):
        user = get_user_model().objects.get(email=email)

        user.set_password(password)
        user.save()

        return RecoverPassword(email=user.email)


class CanRecoverPassword(graphene.Mutation):
    status = graphene.Boolean()

    class Arguments:
        email = graphene.String()
        phone = graphene.String()

    def mutate(self, info, email, phone):
        status = False
        user = get_user_model().objects.get(email=email)

        if user.phone == phone:
            status = True
        else:
            raise Exception("Failed email and phone combination")

        return CanRecoverPassword(status=status)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    update_profile = UpdateProfile.Field()
    change_password = ChangePassword.Field()
    recover_password = RecoverPassword.Field()
    can_recover_password = CanRecoverPassword.Field()


class Query(graphene.ObjectType):
    me = graphene.Field(UserType)
    users = graphene.List(UserType)

    def resolve_me(self, info):
        if info.context.user.is_anonymous:
            raise Exception("not logged in")
        return info.context.user

    def resolve_users(self, info):
        return get_user_model().objects.all()
