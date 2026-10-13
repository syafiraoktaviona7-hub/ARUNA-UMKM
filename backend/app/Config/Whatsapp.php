<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Whatsapp extends BaseConfig
{
    public string $gatewayUrl = '';
    public string $apiKey     = '';
    public int    $deviceId   = 0;

    public function __construct()
    {
        parent::__construct();

        $this->gatewayUrl = (string) env('whatsapp.gatewayUrl', 'https://owa.gusaha.id/api/v1/send');
        $this->apiKey     = (string) env('whatsapp.apiKey', '');
        $this->deviceId   = (int)    env('whatsapp.deviceId', 0);
    }
}