<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <title><?php wp_title( '|', true, 'right' ); ?></title>
    <link rel="stylesheet" href="<?php echo esc_url( get_stylesheet_uri() ); ?>" type="text/css" />
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <?php wp_head(); ?>
</head>
<body>
    <?php
        // $url = "https://cdn.builder.io/api/v1/html/page?apiKey=84172e50b84c48aeb14aad651e29d160&url=/";
        // $response = file_get_contents($url);
        // $data = json_decode($response, true);
        // echo $data["data"]["html"];
    ?>
    <?php
      [$html, $initial_data] = render_page(["name" => "XD"]);
    ?>
    <div id="root"><?= $html; ?></div>
    <hr/>
    <script>window.__INITIAL_STATE__ = <?= $initial_data; ?>;</script>
    <?php wp_footer(); ?>
    <?= render_component("Title", ["name" => "AEAAAAA", "children" => render_component("Counter")]); ?>
</body>
</html>

