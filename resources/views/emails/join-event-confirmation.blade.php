<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You're in! 🎉</title>
    <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">
    <style>
        body {
            font-family: 'Montserrat', sans-serif;
            background-color: #f9fafb;
            color: #374151;
            margin: 0;
            padding: 0;
            text-align: center;
        }

        .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            background-color: #4f46e5;
            color: white;
            padding: 20px;
            border-radius: 12px 12px 0 0;
        }

        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background-color: #4f46e5;
            color: white;
            text-decoration: none;
            font-weight: bold;
            border-radius: 8px;
        }

        .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #6b7280;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome, {{ $user->name }}!</h1>
        </div>
        <p>You've successfully joined <strong>{{ $event->name }}</strong>! 🚀</p>
        <p>Here are the event details:</p>
        <p><strong>📅 Date:</strong> {{ \Carbon\Carbon::parse($event->start_date)->format('F j, Y') }}</p>
        <p><strong>📍 Location:</strong>
            <a href="https://www.google.com/maps?q={{ $latitude }},{{$longitude}}" target="_blank">Open in Google Maps</a>
        </p>
        <p><strong>⏰ Time:</strong> {{ \Carbon\Carbon::parse($event->start_time)->format('h:i A') }}</p>


        <p class="footer">Thank you for joining! See you there! 🎊</p>
    </div>
</body>

</html>