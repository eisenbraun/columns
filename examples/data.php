<?php
    $json = json_decode(file_get_contents('data.json'), 1);

    if (isset($_GET['query']) && $_GET['query'] != false) {
        $temp = array();
        foreach ($json as $key => $row) {
            foreach($row as $value) {
                if (preg_match('/'.$_GET['query'].'/i', $value)) {
                    array_push($temp, $json[$key]);
                    break;
                }
            }
        }
        $json = $temp;
    }

    if (isset($_GET['sortBy']) && $_GET['sortBy'] != false) {
        foreach ($json as $key => $row) {
            $sortBy[$key]  = $row[$_GET['sortBy']];
        }

        if ($_GET['reverse'] == 'true') { 
            array_multisort($sortBy, SORT_DESC, $json);
        } else { 
            array_multisort($sortBy, SORT_ASC, $json);
        }
        
    }

    if (isset($_GET['size'])) { 
        $pages = ceil(count($json)/$_GET['size']); 
    }

    $response['total'] = count($json); 
    $response['pages'] = $pages; 

    if (isset($_GET['page'])) {
        $json = (array_slice($json, (($_GET['page']-1) * $_GET['size']), $_GET['size']));
    }

    $response['data'] = $json; 
    
    echo json_encode($response);
    

    