# Zero Dependency Todo List API Documentation

## Overview

This API allows you to manage a todo list with zero dependencies.

## How to run

```bash
npm run start
```

## Endpoints

### List all
```bash
curl -X GET "http://localhost:3333/tasks"
```

### Search
```bash
curl -X GET "http://localhost:3333/tasks?search=wash dishes"
```

### Create
```bash
curl -X POST "http://localhost:3333/tasks" -H "Content-Type: application/json" -d '{"title": "New task", "description": "blabla"}'
```

### Delete
```bash
curl -X DELETE "http://localhost:3333/tasks/TASK_ID"
```

### Update
```bash
curl -X PUT "http://localhost:3333/tasks/TASK_ID" -H "Content-Type: application/json" -d '{"title": "New Title", "description": "New Description"}'
```

### Complete
```bash
curl -X PATCH "http://localhost:3333/tasks/TASK_ID/complete"
```

### Import CSV
```bash
curl -X POST "http://localhost:3333/tasks/import_csv" -F "file=@sample.csv"
# OR
curl -X POST "http://localhost:3333/tasks/import_csv" -H "Content-Type: application/json" -d '{"csv": [["Task 1", "Description 1"], ["Task 2", "Description 2"]]}'
```

License

This project is licensed under the MIT License.
