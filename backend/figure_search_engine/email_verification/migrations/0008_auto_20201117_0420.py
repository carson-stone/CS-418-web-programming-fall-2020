# Generated by Django 2.2 on 2020-11-17 04:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('email_verification', '0007_auto_20201117_0311'),
    ]

    operations = [
        migrations.AlterField(
            model_name='email',
            name='code',
            field=models.CharField(default='jhuWJonjesiJTAW', max_length=15),
        ),
    ]