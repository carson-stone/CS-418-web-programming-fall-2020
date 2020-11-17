from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings

from email_verification.models import Email

import graphene
from graphene_django import DjangoObjectType
from .models import Profile


class ProfileType(DjangoObjectType):
    class Meta:
        model = Profile


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()

    email_verified = graphene.Boolean()
    profile = graphene.Field(ProfileType)

    def resolve_email_verified(self, info):
        return True if self.email_verified.verified else False

    def resolve_profile(self, info):
        try:
            return Profile.objects.get(user=self)
        except:
            return None


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
        user.profile.create()

        email_object = Email(user=user)
        email_object.save()

        send_mail(
            "Figure Search Engine: please verify your email address",
            f"your code is {email_object.code}",
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )

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


class IsUserVerified(graphene.Mutation):
    verified = graphene.Boolean()

    class Arguments:
        email = graphene.String()

    def mutate(self, info, email):
        user = get_user_model().objects.get(username=email)

        if user.email_verified.verified:
            return IsUserVerified(verified=True)

        return IsUserVerified(verified=False)


class VerifyEmail(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        email = graphene.String()
        code = graphene.String()

    def mutate(self, info, email, code):
        user = get_user_model().objects.get(username=email)
        email_object = user.email_verified

        if code == user.email_verified.code:
            email_object.verified = True
            email_object.save()

            return VerifyEmail(success=True)

        return VerifyEmail(success=False)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    update_profile = UpdateProfile.Field()
    change_password = ChangePassword.Field()
    recover_password = RecoverPassword.Field()
    can_recover_password = CanRecoverPassword.Field()
    is_user_verified = IsUserVerified.Field()
    verify_email = VerifyEmail.Field()


class Query(graphene.ObjectType):
    me = graphene.Field(UserType)
    users = graphene.List(UserType)

    def resolve_me(self, info):
        if info.context.user.is_anonymous:
            raise Exception("not logged in")
        return info.context.user

    def resolve_users(self, info):
        return get_user_model().objects.all()
