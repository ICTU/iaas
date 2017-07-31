#### Provision nfs server

```
ansible-playbook provision-nfs.yml \
  --extra-vars=@var/nfs-vars.yml \
  --extra-vars=@auth.yml
```

#### Provision infra server

```
ansible-playbook provision-infra-services.yml \
  --extra-vars=@var/infra-vars.yml \
  --extra-vars=@auth.yml
```

#### Provision compute node

```
ansible-playbook provision-compute-node.yml \
  --extra-vars=@var/node-vars.yml \
  --extra-vars=@auth.yml
```
