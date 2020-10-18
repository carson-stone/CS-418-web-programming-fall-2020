from django.db import models


class Figure(models.Model):
    patent_id = models.TextField()
    object = models.TextField()
