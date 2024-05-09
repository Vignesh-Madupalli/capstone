from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import pandas as pd
from .models import CSVFile, CSVData
from django.core.files.storage import FileSystemStorage
from django.contrib.auth import authenticate, login
from django.db import IntegrityError


@csrf_exempt
def upload_csv(request):
    if request.method == 'POST' and 'csvfile' in request.FILES:
        print("coming here")
        csvfile = request.FILES['csvfile']
        fs = FileSystemStorage()
        filename = fs.save(csvfile.name, csvfile)
        file_path = fs.path(filename)
        username = request.POST.get('username')

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            fs.delete(filename)
            return JsonResponse({'error': 'User does not exist'}, status=404)

        try:
            df = pd.read_csv(file_path)
            columns = list(df.columns)
            print("user:", user)

            csv_file = CSVFile(user=user, file_path=file_path)
            csv_file.save()

            csv_data = CSVData(csv_file=csv_file, data=df.to_json(orient='records'))
            csv_data.save()

            request.session['file_id'] = csv_file.id
            return JsonResponse({
                'message': 'File uploaded successfully',
                'columns': columns,
                'id': csv_file.id
            }, status=200)
        except (pd.errors.ParserError, IntegrityError) as e:
            fs.delete(filename)  # Clean up the uploaded file if it cannot be processed
            return JsonResponse({'error': f"Failed to process file: {str(e)}"}, status=500)
    else:
        return JsonResponse({'error': 'No file uploaded'}, status=400)

@csrf_exempt
def signup(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user = User.objects.create_user(username=data['username'], password=data['password'])
            user.save()
            return JsonResponse({"message": "User created successfully."}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except IntegrityError:
            return JsonResponse({"error": "User could not be created, possible duplicate."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def user_login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user = authenticate(username=data.get('username'), password=data.get('password'))
        if user is not None:
            login(request, user)
            return JsonResponse({"message": "Login successful.", "username": user.username}, status=200)
        else:
            return JsonResponse({"error": "Invalid credentials."}, status=401)
    return JsonResponse({"error": "Only POST method allowed."}, status=405)

@csrf_exempt
def list_user_files(request):
    username = request.GET.get('username')  # Assuming username is passed as a query parameter
    if username:
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        user = request.user  # Fall back to session user

    user_files = CSVFile.objects.filter(user=user).values('id', 'file_path', 'uploaded_at')
    return JsonResponse(list(user_files), safe=False)
@csrf_exempt
def get_data(request):
    try:
        file_id = request.GET.get('file_id')
        x_axis = request.GET.get('x_axis')
        y_axis = request.GET.get('y_axis')
        function = request.GET.get('function', 'sum')

        csv_file = CSVFile.objects.get(id=file_id)
        csv_data = CSVData.objects.get(csv_file=csv_file)
        df = pd.read_json(csv_data.data)

        if x_axis not in df.columns or y_axis not in df.columns:
            return JsonResponse({'error': 'Specified columns not found in the data'}, status=400)

        if function == 'sum':
            result = df.groupby(x_axis)[y_axis].sum().reset_index().to_dict(orient='records')
        elif function == 'average':
            result = df.groupby(x_axis)[y_axis].mean().reset_index().to_dict(orient='records')
        elif function == 'count':
            result = df.groupby(x_axis)[y_axis].count().reset_index().to_dict(orient='records')
        else:
            return JsonResponse({'error': 'Unsupported function specified'}, status=400)

        return JsonResponse({'data': result}, status=200)
    except CSVFile.DoesNotExist:
        return JsonResponse({'error': 'File not found'}, status=404)
    except CSVData.DoesNotExist:
        return JsonResponse({'error': 'Data not found'}, status=404)
    except KeyError:
        return JsonResponse({'error': 'Incorrect data parameters'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



