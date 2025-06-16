from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import uuid
import random
import os

app = Flask(__name__, static_folder='../frontend/public')
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/routes')
def get_routes():
    routes = generate_routes()
    response = jsonify(routes)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response

def generate_routes():
    interfaces = [
        'Подключение Ethernet',
        'Гостевая сеть',
        'Домашняя сеть',
        'VPN соединение',
        'Wi-Fi сеть',
        'Мобильная сеть'
    ]
    
    routes = []
    
    for _ in range(100):
        address = f"{random.randint(1, 223)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}"
        mask = str(random.randint(0, 32))
        gateway = '0.0.0.0' if mask == '0' else f"{random.randint(1, 223)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}"
        
        routes.append({
            'uuid': str(uuid.uuid4()),
            'address': address,
            'mask': mask,
            'gateway': gateway,
            'interface': random.choice(interfaces)
        })
    
    return routes

@app.route('/')
def serve_frontend():
    return send_from_directory('../frontend/public', 'index.html')

@app.route('/dist/<path:filename>')
def serve_js(filename):
    return send_from_directory('../frontend/public/dist', filename)

@app.route('/styles.css')
def serve_css():
    return send_from_directory('../frontend/public', 'styles.css')

if __name__ == '__main__':
    app.run(port=5008, debug=True)
