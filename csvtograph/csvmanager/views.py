from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.storage import FileSystemStorage
from .models import CSVFiles
import pandas as pd
import plotly.express as px

# Create your views here.
@api_view(['POST'])
def csvhandler(request):
    try:
        if request.method == "POST":
            file = request.FILES['myFile']  # get the uploaded file
            fs = FileSystemStorage(location='assets')  # specify the location to save the file
            filename = fs.save(file.name, file)  # save the file
            file_url = fs.url(filename)  # get the file url

            # save to sqlitwe
            my_model = CSVFiles(filename=filename, path="assets"+file_url) 
            my_model.save()
            return Response("CSV Saved", status=status.HTTP_200_OK)
        return Response('Unsupported Method', status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response("CSV not saved", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
@api_view(['GET'])
def getFiles(request):
    try:
        print(request)
        if request.method == "GET":
            files = CSVFiles.objects.all()
            modified_files = []

            for file in files:
                df = pd.read_csv(file.path)  # Assuming 'path' is a field in your model
                columns = list(df.columns)
                modified_files.append({'id': file.id, 'filename': file.filename,'path': file.path, 'columns': columns})
                # print(modified_files)
            return Response(modified_files, status=status.HTTP_200_OK)
        return Response('Unsupported Method', status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response("CSV not saved", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def visualize(request):
    try:
        if request.method == "POST":
            print(request.data)
            df = pd.read_csv(request.data['path'])
            figures = {}
            for column in request.data['selectedColumn']:
                # If col is missing, not doewsnt exist or has empty or nan values.
                if (column not in df.columns) or ((df[column].isna() == False).any() == False):
                    continue
                # If col has lists, explode
                if df[column].apply(lambda x: '[' in x).any():
                    df[column] = df[column].apply(eval)
                    df = df.explode(column)
                # To combine small values to "otgers"
                column_value_counts = df[column].value_counts()
                if request.data['visualizationType'] == 'bar':
                    fig = px.bar(column_value_counts, x=column_value_counts.index, y=column_value_counts.values, labels={"x":column, "y": "Count"}, title="Count of each type of "+ column, color=column_value_counts.index)
                    fig.update_layout(hovermode="x")
                    figures[column] = fig.to_json()
                elif request.data['visualizationType'] == 'pie':
                    fig = px.pie(column_value_counts, names=column_value_counts.index, values=column_value_counts.values, title="Count of each type of "+ column)
                    # fig.update_layout(hovermode="x")
                    figures[column] = fig.to_json()
                else:
                    return Response('Unsupported Visualization Type', status=status.HTTP_400_BAD_REQUEST)
            return Response(figures, status=status.HTTP_200_OK)
        return Response('Unsupported Method', status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response("CSV not saved", status=status.HTTP_500_INTERNAL_SERVER_ERROR)