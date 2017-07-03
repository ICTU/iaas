#### To create the infra services VM (and port) run:

```
ansible-playbook -i "127.0.0.1," create-os-all.yml  --extra-vars=@infra-vars.yml \
                 --extra-vars='{"odcn": {"auth_url": "<os auth url>", "username": "<os username>", "password": "<os password>", "project_name": "ICTU"}}'
```

#### To create the NFS VM (and port) run:

```
ansible-playbook -i "127.0.0.1," create-os-all.yml  --extra-vars=@nfs-vars.yml \
                 --extra-vars='{"odcn": {"auth_url": "<os auth url>", "username": "<os username>", "password": "<os password>", "project_name": "ICTU"}}'
```
