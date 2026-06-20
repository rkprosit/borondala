<?php
require_once __DIR__ . '/config.php';
try {
    $pdo = getDB();
    $category = isset($_GET['category']) ? $_GET['category'] : null;
    if ($category && $category !== 'all') {
        $stmt = $pdo->prepare("SELECT * FROM portfolio_items WHERE category = ? ORDER BY display_order ASC, id DESC");
        $stmt->execute([$category]);
    } else {
        $stmt = $pdo->query("SELECT * FROM portfolio_items ORDER BY display_order ASC, id DESC");
    }
    echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
