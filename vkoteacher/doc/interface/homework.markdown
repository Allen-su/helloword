####ajax需要显示的数据

* 作业
    + 作业列表页
        - 
        - 
    + 作业详情页
        - 获取问题与答案列表
        - url:
        - data
            * success
            * data
                + title ：2015-04-15 语文作业选择题
                + isPic : true/false
                + list : [ {},{},{} ] 
                    - 图片作业：{
                        * question:"imgurl",
                        * answer:"imgurl"/ABCD/√ X,
                        * questionType:"主观题/判断题/选择题"√}
                    - 文字作业：{
                        * question:"html", 
                        * answer:/ABCD/√ X}
    + 作业统计页
        - 获取所有问题ID
            * url:
            * data
                + success
                + data : [id,id];
        - 获取答案统计
            * url:
            * data
                + success
                + data : 
                    - questionType: 主观题/选择题/判断题
                    - anwser：{ //非主观题
                        * A : [学生名,学生名,学生名],
                        * BC : [学生名,学生名,学生名],
                        * √ : [学生名,学生名,学生名],
                        * X : [学生名,学生名,学生名]
                    }
                    - anwser：[ //主观题
                        {name:学生名, img:[imgurl,imgurl,imgurl]},
                        {name:学生名, img:[imgurl,imgurl,imgurl]},
                        {name:学生名, img:[imgurl,imgurl,imgurl]}
                    ]
        
                