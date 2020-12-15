from django.db import models
from django.contrib.auth import get_user_model

import random, string


def generate_random_verification_code():
    # from https://www.askpython.com/python/examples/generate-random-strings-in-python
    return "".join(random.choice(string.ascii_letters) for _ in range(12))


class Email(models.Model):
    user = models.OneToOneField(
        get_user_model(),
        related_name="email_verified",
        on_delete=models.CASCADE,
        primary_key=True,
    )
    verified = models.BooleanField(default=False)
    code = models.CharField(default=generate_random_verification_code, max_length=15)