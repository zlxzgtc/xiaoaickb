function scheduleHtmlParser(html) {
    //除函数名外都可编辑
    //传入的参数为上一步函数获取到的html
    //可使用正则匹配
    //可使用解析dom匹配，工具内置了$，跟jquery使用方法一样，直接用就可以了，参考：https://juejin.im/post/5ea131f76fb9a03c8122d6b9
    //以下为示例，您可以完全重写或在此基础上更改
    const startTime=['08:00',"08:50","09:50","10:40","11:30",
                    "13:30","14:20","15:20","16:10","18:30","19:20","20:10"]
    const endTime=["08:45","09:35","10:35","11:25","12:15",
                    "14:15","15:05","16:05","16:55","19:15","20:05","20:55"]
    var time = new Array();
    for(var i=0;i<12;i++){
        time[i]={
        "section": i+1,
        "startTime": startTime[i],
        "endTime": endTime[i]
        }
    }
    var course = new Array();
    var constnum = 0;
    var $ = cheerio.load(html, { decodeEntities: false });
    var daymap = {"一":1,"二":2,"三":3,"四":4,"五":5,"六":6,"七":7};
    $('#Table1 td').each(function(i, elem) {
        console.log($(this).html());
        var tableInfo;
        if($(this).html())
            tableInfo = $(this).html().split('<br>');
        if(tableInfo && tableInfo.length==4){
                var name = tableInfo[0];
                var teacher = tableInfo[2];
                var position = tableInfo[3];
                var day = daymap[tableInfo[1].substring(1, 2)];
                var sessionlist=tableInfo[1].substring(3, tableInfo[1].length).split(',');
                var sessions = new Array();
                sessions[0]=parseInt(sessionlist[0]);
                for(var k = 1;k < sessionlist.length; k++){
                    sessions[k] = sessions[0]+k;
                }
                for(var k = 0;k < sessions.length; k++){
                    sessions[k] =  { "section": sessions[k] };
                }
                weeks = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
                var ifDouble = tableInfo[1].split('|');
                if(ifDouble.length==2){
                    if(ifDouble[1].substring(0,1)=="双") weeks = [2,4,6,8,10,12,14,16,18];
                    else weeks=[1,3,5,7,9,11,13,15,17,19,21];
                }
                course[constnum]={
                    "name": name,
                    "position": position,
                    "teacher": teacher,
                    "weeks": weeks,
                    "day": day,
                    "sections": sessions,
                }
                constnum++;
            }
    });

    console.log(course);
    var conss = new Object();
    conss.courseInfos = JSON.parse(JSON.stringify(course));
    conss.sectionTimes = JSON.parse(JSON.stringify(time));
    var json2 = JSON.stringify(conss);
    console.info(JSON.parse(json2));
    return JSON.parse(json2);

}