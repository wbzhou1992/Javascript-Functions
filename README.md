##Git Learning

###产生ssh key
-`$ ssh-keygen -t rsa`
-`$ cd ~/.ssh && ssh-keygen`

###远程库
-要关联一个远程库，使用命令`$ git remote add origin git@server-name:path/repo-name.git`；
-关联后，使用命令`$ git push -u origin master`第一次推送`master`分支的所有内容；
-此后，每次本地提交后，只要有必要，就可以使用命令`$ git push origin master`推送最新修改；

###分支
-查看分支：`$ git branch`
-创建分支：`$ git branch <name>`
-切换分支：`$ git checkout <name>`
-创建+切换分支：`$ git checkout -b <name>`
-合并某分支到当前分支：`$ git merge <name>`
-删除分支：`$ git branch -d <name>`