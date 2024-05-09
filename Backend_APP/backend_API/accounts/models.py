from django.db import models

from django.db import models
from django.contrib.auth.models import User

class CSVFile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file_path = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

class CSVData(models.Model):
    csv_file = models.ForeignKey(CSVFile, related_name='data', on_delete=models.CASCADE)
    data = models.JSONField()  # Ensure your DB supports JSON fields; otherwise use a TextField and serialize data

    def __str__(self):
        return f"Data for {self.csv_file}"
