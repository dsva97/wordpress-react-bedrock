<?php

$componentsDir = __DIR__ . '/react/dist/client/components';

$components = array_diff(
    scandir(
        $componentsDir
    ),
    array('.','..')
);

function add_type_attribute($tag, $handle, $src) {
    global $components;
    if (in_array($handle, $components) || $handle == "script") {
        $tag = '<script type="module" src="' . esc_url( $src ) . '"></script>';
        return $tag;
    }
    return $tag;
}

add_filter('script_loader_tag', 'add_type_attribute', 10, 3);



wp_enqueue_script(
    'script',
    get_template_directory_uri() . '/react/dist/client/index.js',
    NULL,
    NULL,
    true
);

wp_enqueue_style(
    'style',
    get_template_directory_uri() . '/react/dist/client/index.css'
);

function get_url_path() {
    global $wp;
    $url = home_url( $wp->request );
    return (wp_make_link_relative($url) ?: "/");
}

function render_page ($props) {
    $url_path = get_url_path();
    $initial_data = json_encode($props);
    $encoded_data = base64_encode($initial_data);
    $command = __DIR__ . "/react/dist/ssr/build $url_path App $encoded_data";
    $html = exec($command);
    return [$html, $initial_data];
}

function render_component ($component, $props=[]) {
    $url_path = get_url_path();
    $url_js_component = get_template_directory_uri() . "/react/dist/client/components/$component/index.js";
    $initial_data = json_encode($props);
    $encoded_data = base64_encode($initial_data);
    $command = __DIR__ . "/react/dist/ssr/build $url_path $component $encoded_data";
    $html = exec($command);
    $id_component = $component . "_" . uniqid();
    $all_html = "
    <div id='$id_component'>$html</div>
    <script type='module'>
        import { $component } from '$url_js_component';
        
        const root = document.getElementById('$id_component');

        const initialState = Array.isArray($initial_data) ? {} : $initial_data;

        const resultComponent = React.createElement($component,initialState);

        ReactDOM.hydrateRoot(root, resultComponent);
    </script>
    ";

    $js = get_template_directory_uri() . "/react/dist/client/components/$component/index.js";
    $css = get_template_directory_uri() . "/react/dist/client/components/$component/index.css";

    wp_enqueue_script(
        $component,
        $js,
        NULL,
        NULL,
        true
    );

    wp_enqueue_style(
        $component,
        $css
    );

    return $all_html;
}