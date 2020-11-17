from django.contrib.auth.models import AbstractUser
from django.db import models

from figure.models import Figure


class User(AbstractUser):
    phone = models.TextField()
    interest = models.TextField()


class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="profile")
    saved_figures = models.ManyToManyField(Figure, related_name="saved_by")
