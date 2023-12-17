---
layout: default
title: 发布
description: 下载链接和扫码注册说明
projectArk: True
---
<!-- - [发布](#发布)
  - [主程序](#主程序)
  - [修复程序](#修复程序)
  - [价目表](#价目表)
  - [支付](#支付) -->


<script>
  function myfunction(){
    var url="{{ site.bucket_url }}";
    document.write("<a href=\""+url+"/projectArk_installer.exe\">projectArk</a>");
  }
</script>
## 主程序
> 选择与自身计算机系统版本匹配的主程序
<TABLE cellspacing ="1" cellpadding ="6" border = "0">
  <TR>
    <TH class="Title" align="center" width=auto>程序</TH>
    <TH class="Title" align="center" width=auto>日期</TH>
    <TH class="Title" align="center" width=auto>版本</TH>
    <TH class="Title" align="center" width=auto>说明</TH>
    <TH class="Title" align="center" width=auto>下载地址</TH>
  </TR>
  <TR>
    <TD class="Item" align="center">ProjectArk</TD>
    <TD class="Item" align="center">{{ site.projectArk_version_update }}</TD>
    <TD class="Item" align="center">{{ site.projectArk_version }}</TD>
    <TD class="Item">高性能版，仅支持 windows 10/11</TD>
    <TD class="Item" align="center">
      <script type="text/javascript">
        var cn_url="{{ site.bucket_url }}";
        var git_url="{{ site.fastgit_url }}";
        document.write("<a href=\""+cn_url+"/win11/ProjectArk_Installer.exe\">国内</a>, <a href=\""+git_url+"/win11/ProjectArk_Installer.exe\">国际</a>");
      </script>
    </TD>
  </TR>
  <TR>
    <TD class="Item" align="center">ProjectArk</TD>
    <TD class="Item" align="center">{{ site.projectArk_version_update }}</TD>
    <TD class="Item" align="center">{{ site.projectArk_version }}</TD>
    <TD class="Item">兼容版，windows 各版本均可使用</TD>
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
> 启动错误时安装下列修复程序

<TABLE cellspacing ="1" cellpadding ="6" border = "0">
  <TR>
    <TH class="Title" align="center" width=auto>程序</TH>
    <TH class="Title" align="center" width=auto>日期</TH>
    <TH class="Title" align="center" width=auto>版本</TH>
    <TH class="Title" align="center" width=auto>说明</TH>
    <TH class="Title" align="center" width=auto>下载地址</TH>
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
    <TD class="Item" align="center">OpenSSL</TD>
    <TD class="Item" align="center">2022/10/23</TD>
    <TD class="Item" align="center">x86</TD>
    <TD class="Item">安装修复系统 SSL 连接错误</TD>
    <TD class="Item" align="center">
      <script type="text/javascript">
        var cn_url="{{ site.bucket_url }}";
        var git_url="{{ site.fastgit_url }}";
        document.write("<a href=\""+cn_url+"/Win32OpenSSL_Light-1_1_1u.exe\">国内</a>, <a href=\""+git_url+"/Win32OpenSSL_Light-1_1_1u.exe\">国际</a>");
      </script>
    </TD>
  </TR>
</TABLE>

## 赞助费

<table>
  <tbody>
    <tr>
      <td>月卡-30D</td>
      <td>季卡-90D</td>
      <td>半年卡-180D</td>
      <td>年卡-360D</td>
    </tr>
    <tr>
      <td>50</td>
      <td>135</td>
      <td>255</td>
      <td>480</td>
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

注：邀请新用户赞助可获赠 7D 时长

## 支付
新用户请联系[作者](/index#联系方式)确认注册资格再扫码，并将<a href="https://www.ip138.com">此页面（点击）</a>的IP地址发给作者加入白名单

![1]({{site.cdn}}/resource/donate.png)
<!-- <p>Password: Please <A href="/">contact author</a></p> -->
<!-- projectArk {{ site.projectArk_version }} -->
<!-- projectArk-VIP {{ site.projectArk_version }} -->