<?php
require_once __DIR__ . '/config.php';
try {
    $pdo = getDB();
    $stmt = $pdo->query("SELECT * FROM videos ORDER BY display_order ASC, id DESC");
    echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
