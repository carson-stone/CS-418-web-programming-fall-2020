# Generated by Django 2.2 on 2020-11-17 03:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('email_verification', '0005_auto_20201117_0236'),
    ]

    operations = [
        migrations.AlterField(
            model_name='email',
            name='code',
            field=models.CharField(default='HmwehxSnPCWeJIo', max_length=15),
        ),
    ]
