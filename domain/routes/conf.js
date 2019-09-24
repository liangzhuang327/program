var conf = function (domain, iport) {
    return `
    server {
        listen       80;
        server_name  ${domain};
        proxy_buffer_size 32k;
        proxy_buffers 4 64k;
        proxy_busy_buffers_size 128k;
	proxy_connect_timeout 600;
        proxy_read_timeout 600;
        proxy_send_timeout 600;
        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            proxy_set_header        Host            $host;
	    proxy_set_header        X-Real-IP       $remote_addr;
	    proxy_set_header        x-forwarded-for $proxy_add_x_forwarded_for;
	    proxy_set_header Accept-Encoding 'gzip';
            proxy_pass ${iport};
        } 
    }
    `;
};

module.exports = conf;
