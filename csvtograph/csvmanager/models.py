from django.db import models
from django.contrib import admin

# Create your models here.
class CSVFiles(models.Model):
    filename = models.CharField(max_length=255)
    path = models.CharField(max_length=255)

    class Meta:
        verbose_name_plural = "CSV Files"
  
admin.site.register(CSVFiles)