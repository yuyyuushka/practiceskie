const http = require('http');
const url = require('url');

let users = [
    { id: 1, name: 'Иван Иванов', email: 'i.van@example.com' },
    { id: 2, name: 'Петр Петров', email: 'petr@example.com' },
    { id: 3, name: 'Мария Сидорова', email: 'maria@example.com' }
];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Methods", 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", 'Content-Type');

    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    console.log(`${new Date().toISOString()} - ${method} ${pathname}`);

    if (pathname === '/' && method === 'GET') {
        handleHome(req, res);
    } else if (pathname === '/api/users' && method === 'GET') {
        handleGetUsers(req, res);
    } else if (pathname === '/api/users' && method === 'POST') {
        handleCreateUser(req, res);
    } else if (pathname.startsWith('/api/users/') && method === 'GET') {
        handleGetUser(req, res, pathname);
    } else if (pathname.startsWith('/api/users/') && method === 'PUT') {
        handleUpdateUser(req, res, pathname);
    } else if (pathname.startsWith('/api/users/') && method === 'DELETE') {
        handleDeleteUser(req, res, pathname);
    } else if (pathname === '/api/status' && method === 'GET') {
        handleStatus(req, res);
    } else {
        handleNotFound(req, res);
    }
});

function handleHome(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        message: 'Добро пожаловать на сервер',
        endpoints: {
            '/api/users': 'GET, POST - работа с пользователями',
            '/api/users/:id': 'GET, PUT, DELETE - работа с конкретным пользователем',
            '/api/status': 'GET - информация о сервере'
        }
    }));
}

function handleGetUsers(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
}

function handleGetUser(req, res, pathname) {
    const userId = parseInt(pathname.split('/')[3]);
    const user = users.find(u => u.id === userId);

    if (!user) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Пользователь не найден' }));
        return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
}

function handleCreateUser(req, res) {
    let body = "";
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const newUser = JSON.parse(body);

            if (!newUser.name || !newUser.email) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Имя и email обязательны' }));
                return;
            }

            const user = {
                id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
                name: newUser.name,
                email: newUser.email
            };

            users.push(user);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Неверный формат JSON' }));
        }
    });
}

function handleUpdateUser(req, res, pathname) {
    const userId = parseInt(pathname.split('/')[3]);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Пользователь не найден' }));
        return;
    }

    let body = "";
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const updateData = JSON.parse(body);
            users[userIndex] = { ...users[userIndex], ...updateData };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users[userIndex]));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Неверный формат JSON' }));
        }
    });
}

function handleDeleteUser(req, res, pathname) {
    const userId = parseInt(pathname.split('/')[3]);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Пользователь не найден' }));
        return;
    }

    const deletedUser = users.splice(userIndex, 1)[0];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Пользователь удален', user: deletedUser }));
}

function handleStatus(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        status: 'Server is running',
        timestamp: new Date().toISOString(),
        userCount: users.length,
        memoryUsage: process.memoryUsage()
    }));
}

function handleNotFound(req, res) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Маршрут не найден' }));
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log('Доступные endpoints:');
    console.log(` GET http://localhost:${PORT}/`);
    console.log(` GET http://localhost:${PORT}/api/users`);
    console.log(` POST http://localhost:${PORT}/api/users`);
    console.log(` GET http://localhost:${PORT}/api/users/:id`);
    console.log(` PUT http://localhost:${PORT}/api/users/:id`);
    console.log(` DELETE http://localhost:${PORT}/api/users/:id`);
    console.log(` GET http://localhost:${PORT}/api/status`);
});