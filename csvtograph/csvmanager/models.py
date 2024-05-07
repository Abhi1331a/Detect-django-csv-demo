from django.db import models

# Create your models here.
class CSVFiles(models.Model):
  filename = models.CharField(max_length=255)
  path = models.CharField(max_length=255)