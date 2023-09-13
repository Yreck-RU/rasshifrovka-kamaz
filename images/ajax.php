<?php

/**
 * @package     Motokraft.Site
 * @subpackage  plg_k2_reaction
 *
 * @copyright   2022 Motokraft. All rights reserved.
 * @license     MIT License
 */

define('_JEXEC', 1);
define('DS', DIRECTORY_SEPARATOR);

$root = dirname(dirname(dirname(__DIR__)));
define('JPATH_BASE', $root);

if (!defined('_JDEFINES'))
{
	require_once JPATH_BASE.'/includes/defines.php';
}

require_once JPATH_BASE . '/includes/framework.php';

$app = JFactory::getApplication('site');

$session = JFactory::getSession();
$token = $session->getFormToken();

if(!$app->input->get($token, false))
{
    exit(json_encode([
        'message' => 'Invalid Token',
        'success' => false
    ]));
}

$id = $app->input->getInt('item_id');
$key = $app->input->getInt('key');

$ip = $_SERVER['REMOTE_ADDR'];
$db = JFactory::getDBO();

$get_total = function($id, $key = null)
{
    $db = JFactory::getDbo();
    $query = $db->getQuery(true);

    $query->select('COUNT(id)');

    $query->from($db->quoteName(
        '#__k2_reaction'
    ));

    $where = $db->quoteName('item_id');
    $query->where($where . ' = ' . $id);

    if(is_numeric($key))
    {
        $where = $db->quoteName('key');
        $query->where($where . ' = ' . $key);
    }

    $db->setQuery($query);
    return (int) $db->loadResult();
};

$has_current_key = function ($id, $key)
{
    $db = JFactory::getDbo();
    $ip = $_SERVER['REMOTE_ADDR'];

    $query = $db->getQuery(true);
    $query->select($db->quoteName('key'));

    $query->from($db->quoteName(
        '#__k2_reaction'
    ));

    $where = $db->quoteName('item_id');
    $query->where($where . ' = ' . $id);

    $where = $db->quoteName('ip');
    $value = 'INET_ATON(\'' . $ip . '\')';
    $query->where($where . ' = ' . $value);

    $db->setQuery($query);

    $result = (int) $db->loadResult();
    return ($result === (int) $key);
};

try
{
    $db->transactionStart();

    $query = $db->getQuery(true);
    $query->select($db->quoteName('id'));

    $query->from($db->quoteName(
        '#__k2_reaction'
    ));

    $where = $db->quoteName('item_id');
    $query->where($where . ' = ' . (int) $id);

    $where = $db->quoteName('ip');
    $value = 'INET_ATON(\'' . $ip . '\')';
    $query->where($where . ' = ' . $value);

    $db->setQuery($query);
    $item_id = (int) $db->loadResult();

    if($has_current_key($id, $key))
    {
        $query = $db->getQuery(true);

        $query->delete($db->quoteName(
            '#__k2_reaction'
        ));

        $where = $db->quoteName('id');
        $query->where($where . ' = ' . $item_id);
        $db->setQuery($query)->execute();
    }
    else
    {
        $query = $db->getQuery(true);

        $query->delete($db->quoteName(
            '#__k2_reaction'
        ));

        $where = $db->quoteName('id');
        $query->where($where . ' = ' . $item_id);
        $db->setQuery($query)->execute();

        $query = $db->getQuery(true);

        $query->insert($db->quoteName(
            '#__k2_reaction'
        ));

        $query->columns($db->quoteName([
            'item_id', 'ip', 'key'
        ]));

        $query->values(implode(',', [
            (int) $id,
            'INET_ATON(\'' . $ip . '\')',
            (int) $key
        ]));

        $db->setQuery($query)->execute();
    }

    $db->transactionCommit();
}
catch (\Exception $e)
{
    $db->transactionRollback();
    
    exit(json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]));
}

exit(json_encode([
    'success' => true,
    'total' => $get_total($id),
    'items' => [
        $get_total($id, 1),
        $get_total($id, 2),
        $get_total($id, 3),
        $get_total($id, 4),
        $get_total($id, 5),
        $get_total($id, 6),
        $get_total($id, 7),
        $get_total($id, 8)
    ]
]));