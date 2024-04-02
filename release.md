---
layout: default
title: 发布
description: 赞助与下载安装程序
projectArk: True
---


## 赞助
>注：邀请新用户赞助可获赠 7 天时长

<table>
  <tbody>
    <tr>
      <td>50元</td>
      <td>135元</td>
      <td>255元</td>
      <td>480元</td>
    </tr>
    <tr>
      <td>30天</td>
      <td>90天</td>
      <td>180天</td>
      <td>360天</td>
    </tr>
  </tbody>
  <colgroup>
    <col>
    <col>
    <col>
    <col>
    <col>
  </colgroup>
</table>


<!-- projectArk {{ site.projectArk_version }} -->
<!-- projectArk-VIP {{ site.projectArk_version }} -->


<script>
  function myfunction(){
    var url="{{ site.bucket_url }}";
    document.write("<a href=\""+url+"/projectArk_installer.exe\">projectArk</a>");
  }
</script>
## 下载地址
> 选择与自身计算机系统版本匹配的主程序
<TABLE cellspacing ="1" cellpadding ="6" border = "0">
  <TR>
    <TH class="Title" align="center" width=auto>程序</TH>
    <TH class="Title" align="center" width=auto>更新日期</TH>
    <TH class="Title" align="center" width=auto>版本</TH>
    <TH class="Title" align="center" width=auto>系统</TH>
    <TH class="Title" align="center" width=auto>下载线路</TH>
  </TR>
  <TR>
    <TD class="Item" align="center">ProjectArk</TD>
    <TD class="Item" align="center">{{ site.projectArk_version_update }}</TD>
    <TD class="Item" align="center">{{ site.projectArk_version }}</TD>
    <TD class="Item">windows 10/11 专用</TD>
    <TD class="Item" align="center">
      <script type="text/javascript">
        var cn_url="{{ site.bucket_url }}";
        var git_url="{{ site.fastgit_url }}";
        document.write("<a href=\""+cn_url+"/win11/ProjectArk_Installer.exe\">国内</a>, <a href=\""+git_url+"/win11/ProjectArk_Installer.exe\">国际</a>");
      </script>
    </TD>
  </TR>
  <TR>
    <TD class="Item" align="center">ProjectArk 兼容版</TD>
    <TD class="Item" align="center">{{ site.projectArk_version_update }}</TD>
    <TD class="Item" align="center">{{ site.projectArk_version }}</TD>
    <TD class="Item">windows 全系列</TD>
    <TD class="Item" align="center">
      <script type="text/javascript">
        var cn_url="{{ site.bucket_url }}";
        var git_url="{{ site.fastgit_url }}";
        document.write("<a href=\""+cn_url+"/win7/ProjectArk_Installer.exe\">国内</a>, <a href=\""+git_url+"/win7/ProjectArk_Installer.exe\">国际</a>");
      </script>
    </TD>
  </TR>
</TABLE>


## 修复程序
> 仅在程序无法正常启动时下载安装

<TABLE cellspacing ="1" cellpadding ="6" border = "0">
  <TR>
    <TH class="Title" align="center" width=auto>程序</TH>
    <TH class="Title" align="center" width=auto>更新日期</TH>
    <TH class="Title" align="center" width=auto>版本</TH>
    <TH class="Title" align="center" width=auto>说明</TH>
    <TH class="Title" align="center" width=auto>下载线路</TH>
  </TR>
  <TR>
    <TD class="Item" align="center">VC++ 2015-2022</TD>
    <TD class="Item" align="center">2022/10/23</TD>
    <TD class="Item" align="center">x64</TD>
    <TD class="Item">安装 VC++ 运行库修复启动错误</TD>
    <TD class="Item" align="center">
      <script type="text/javascript">
        var cn_url="{{ site.bucket_url }}";
        var git_url="{{ site.fastgit_url }}";
        document.write("<a href=\""+cn_url+"/VC_redist_2015-2022.x64.exe\">国内</a>, <a href=\""+git_url+"/VC_redist_2015-2022.x64.exe\">国际</a>");
      </script>
    </TD>
  </TR>
  <TR>
    <TD class="Item" align="center">VC++ 2015-2022</TD>
    <TD class="Item" align="center">2022/10/23</TD>
    <TD class="Item" align="center">x86</TD>
    <TD class="Item">安装 VC++ 运行库修复启动错误</TD>
    <TD class="Item" align="center">
      <script type="text/javascript">
        var cn_url="{{ site.bucket_url }}";
        var git_url="{{ site.fastgit_url }}";
        document.write("<a href=\""+cn_url+"/VC_redist_2015-2022.x86.exe\">国内</a>, <a href=\""+git_url+"/VC_redist_2015-2022.x86.exe\">国际</a>");
      </script>
    </TD>
  </TR>
  <TR>
    <TD class="Item" align="center">.NET Framework</TD>
    <TD class="Item" align="center">2019/04/18</TD>
    <TD class="Item" align="center">v4.8</TD>
    <TD class="Item">安装 .NET 组件修复启动闪退</TD>
    <TD class="Item" align="center">
      <script type="text/javascript">
        var cn_url="{{ site.bucket_url }}";
        var git_url="{{ site.fastgit_url }}";
        document.write("<a href=\""+cn_url+"/ndp48-web.exe\">国内</a>, <a href=\""+git_url+"/ndp48-web.exe\">国际</a>");
      </script>
    </TD>
  </TR>
  <TR>
    <TD class="Item" align="center">OpenSSL 1.1.1u</TD>
    <TD class="Item" align="center">2016/9/22</TD>
    <TD class="Item" align="center">x86</TD>
    <TD class="Item">安装 OpenSSL 修复启动闪退</TD>
    <TD class="Item" align="center">
      <script type="text/javascript">
        var cn_url="{{ site.bucket_url }}";
        var git_url="{{ site.fastgit_url }}";
        document.write("<a href=\""+cn_url+"/Win32OpenSSL_Light-1_1_1u.exe\">国内</a>, <a href=\""+git_url+"/Win32OpenSSL_Light-1_1_1u.exe\">国际</a>");
      </script>
    </TD>
  </TR>
</TABLE>