cp /mnt/d/Data/VSCode/FPW/dolphin-streak/ansible-deploy/* ~/ansible-projects
ansible-playbook -i hosts deploy.yml -e 'ansible_python_interpreter=/mnt/d/Data/VSCode/FPW/dolphin-streak/ansible-azure-env/bin/python' -vvv

ansible-playbook -i hosts deploy.yml -e 'ansible_python_interpreter=/usr/bin/python3' -vvv