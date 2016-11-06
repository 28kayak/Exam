<?php
/** path to the file: /Applications/XAMPP/xamppfiles/htdocs/secret
*/
?>

<?php
$user = 'amazon';
$password = 'candidate';

if (!isset($_SERVER['PHP_AUTH_USER']))
{
    header('WWW-Authenticate: Basic realm="Private Page"');
    header('HTTP/1.0 401 Unauthorized');
    ?>
    	<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
		<html><head>
		<title>401 Authorization Required</title>
		</head><body>
		<h1>Authorization Required</h1>
		<p>This server could not verify that you
		are authorized to access the document
		requested.  Either you supplied the wrong
		credentials (e.g., bad password), or your
		browser doesn't understand how to supply
		the credentials required.</p>
		<hr>
		<address>Apache/2.2.29 (Amazon) Server at 1.2.3.4 Port 80</address>
		</body></html>

    <?
    die('ERROR');
}else{
    if ($_SERVER['PHP_AUTH_USER'] != $user
        || $_SERVER['PHP_AUTH_PW'] != $password){

        header('WWW-Authenticate: Basic realm="Private Page"');
        header('HTTP/1.0 401 Unauthorized');
        ?>
        <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
		<html><head>
		<title>401 Authorization Required</title>
		</head><body>
		<h1>Authorization Required</h1>
		<p>This server could not verify that you
		are authorized to access the document
		requested.  Either you supplied the wrong
		credentials (e.g., bad password), or your
		browser doesn't understand how to supply
		the credentials required.</p>
		<hr>
		<address>Apache/2.2.29 (Amazon) Server at 1.2.3.4 Port 80</address>
		</body></html>

        <?
        die('ERROR<br>');
    }
}//else
echo "Success";
?>

