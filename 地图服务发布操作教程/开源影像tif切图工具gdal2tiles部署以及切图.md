# 切片效果图 
![](https://gitee.com/gishome/gis-learning-circle/raw/main/%E6%95%88%E6%9E%9C%E5%9B%BE/title1.png)   

![](https://gitee.com/gishome/gis-learning-circle/raw/main/%E6%95%88%E6%9E%9C%E5%9B%BE/title2.png)   
> 
- 安装python，这个网上很多教程，参照网上教程安装即可，这里不再描述。
- python安装python版本的gdal，以我本机python3.7版本为例： 
1.下载gdal的whl文件安装包，下载版本跟本机安装的python版本匹配就行
[gdal下载地址](https://www.cgohlke.com/)  
![](https://gitee.com/gishome/gis-learning-circle/raw/main/%E6%95%88%E6%9E%9C%E5%9B%BE/title3.png)    

2.下载完之后，拷贝到python安装目录下：D:\Program Files\Python37\Scripts（这是我本机安装的目录） 
![](https://gitee.com/gishome/gis-learning-circle/raw/main/%E6%95%88%E6%9E%9C%E5%9B%BE/title4.png)    

3.当前目录下，CMD命令行输入pip install GDAL-3.0.4-cp37-cp37m-win_amd64.whl包文件名即可,安装成功之后可以看到gdal2tiles.py切图工具脚本文件。 
![](https://gitee.com/gishome/gis-learning-circle/raw/main/%E6%95%88%E6%9E%9C%E5%9B%BE/title5.png)    

> 
- 运行测试gdal2tiles.py切图工具 
- 拷贝gdal2tiles.py文件到某个目录下，我以我本机截图为例子： 
1.准备好切图影像数据，我本机是Input4326.tif     
![](https://gitee.com/gishome/gis-learning-circle/raw/main/%E6%95%88%E6%9E%9C%E5%9B%BE/title6.png)    
2.打开CMD命令窗口，输入切图工具命令：    
![](https://gitee.com/gishome/gis-learning-circle/raw/main/%E6%95%88%E6%9E%9C%E5%9B%BE/title7.png)    

![](https://gitee.com/gishome/gis-learning-circle/raw/main/%E6%95%88%E6%9E%9C%E5%9B%BE/title8.png)    
3.查看切图数据成果： 
![](https://gitee.com/gishome/gis-learning-circle/raw/main/%E6%95%88%E6%9E%9C%E5%9B%BE/title9.png)   

![](https://gitee.com/gishome/gis-learning-circle/raw/main/%E6%95%88%E6%9E%9C%E5%9B%BE/title10.png)     