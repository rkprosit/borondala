<?php
require_once __DIR__ . '/config.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error' => 'Method not allowed']); exit; }
try {
    $pdo = getDB();
    $services = [];
    if (!empty($_POST['Photography'])) $services[] = 'Photography';
    if (!empty($_POST['Videography'])) $services[] = 'Videography';
    if (!empty($_POST['Both'])) $services[] = 'Both';
    $stmt = $pdo->prepare("INSERT INTO estimates (name, email, phone, event_type, event_date, budget, services, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$_POST['Name'] ?? '', $_POST['Email'] ?? '', $_POST['Phone'] ?? '', $_POST['Event Type'] ?? '', $_POST['Event Date'] ?? '', $_POST['Budget'] ?? '', implode(', ', $services), $_POST['Details'] ?? '']);
    echo json_encode(['success' => true, 'message' => 'Thank you! I will review your request and get back to you within 24 hours.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Something went wrong. Please try again.']);
}
