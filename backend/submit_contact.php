<?php
require_once __DIR__ . '/config.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error' => 'Method not allowed']); exit; }
try {
    $pdo = getDB();
    $stmt = $pdo->prepare("INSERT INTO contacts (name, email, event_type, event_date, message) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$_POST['Name'] ?? '', $_POST['Email'] ?? '', $_POST['Event Type'] ?? '', $_POST['Event Date'] ?? '', $_POST['Message'] ?? '']);
    echo json_encode(['success' => true, 'message' => 'Thank you! Your message has been received.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Something went wrong. Please try again.']);
}
