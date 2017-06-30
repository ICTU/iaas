Run with

```
# to create the port with a fixed ip
ansible-playbook -i "127.0.0.1," create-os-all.yml  --extra-vars=@vars.yml --extra-vars='{"odcn": {"auth_url": "<os auth url>", "username": "<os username>", "password": "<os password>", "project_name": "ICTU"}}'
