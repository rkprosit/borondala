<?php
session_start();
require_once __DIR__ . '/../backend/config.php';
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $pdo = getDB();
        $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = ?");
        $stmt->execute([$_POST['username'] ?? '']);
        $user = $stmt->fetch();
        if ($user && password_verify($_POST['password'] ?? '', $user['password_hash'])) {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_user'] = $user['username'];
            header('Location: index.php');
            exit;
        } else { $error = 'Invalid credentials'; }
    } catch (Exception $e) { $error = 'Database error. Did you run setup.php?'; }
}
?>
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Admin Login</title><link rel="stylesheet" href="style.css"></head>
<body><div class="login-page"><form class="login-form" method="POST"><h1>Borondala Admin</h1><?php if ($error): ?><div class="alert alert-error"><?= htmlspecialchars($error) ?></div><?php endif; ?><input type="text" name="username" placeholder="Username" required><input type="password" name="password" placeholder="Password" required><button type="submit" class="btn">Login</button></form></div></body>
</html>
