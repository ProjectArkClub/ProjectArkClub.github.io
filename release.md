---
layout: default
title: 下载
description: 下载和修复
projectArk: True
---


>注：邀请新用户注册可获赠 7 天时长



<!-- projectArk {{ site.projectArk_version }} -->
<!-- projectArk-VIP {{ site.projectArk_version }} -->


<script>
  function myfunction(){
    var url="{{ site.bucket_url }}";
    document.write("<a href=\""+url+"/setup.exe\">projectArk</a>");
  }
</script>
## 下载地址
<!-- 备用下载源（腾讯COS，原"国内"线路）: {{ site.bucket_url }} ，文件路径与下表一致 -->
> 根据使用的计算机系统版本选择
<TABLE cellspacing ="1" cellpadding ="6" border = "0">
  <TR>
    <TH class="Title" align="center" width=auto>程序</TH>
    <TH class="Title" align="center" width=auto>更新日期</TH>
    <TH class="Title" align="center" width=auto>版本</TH>
    <TH class="Title" align="center" width=auto>计算机系统</TH>
    <TH class="Title" align="center" width=auto>链接</TH>
  </TR>
  <TR>
    <TD class="Item" align="center">主程序</TD>
    <TD class="Item" align="center">{{ site.projectArk_version_update }}</TD>
    <TD class="Item" align="center">{{ site.projectArk_version }}</TD>
    <TD class="Item">windows 10/11</TD>
    <TD class="Item" align="center">
      <script type="text/javascript">
        var git_url="{{ site.fastgit_url }}";
        document.write("<a href=\""+git_url+"/win11/setup.exe\">下载</a>");
      </script>
    </TD>
  </TR>
  <TR>
    <TD class="Item" align="center">兼容版</TD>
    <TD class="Item" align="center">{{ site.projectArk_version_update }}</TD>
    <TD class="Item" align="center">{{ site.projectArk_version }}</TD>
    <TD class="Item">windows 全系列</TD>
    <TD class="Item" align="center">
      <script type="text/javascript">
        var git_url="{{ site.fastgit_url }}";
        document.write("<a href=\""+git_url+"/win7/setup.exe\">下载</a>");
      </script>
    </TD>
  </TR>
</TABLE>


## 修复程序
> 程序无法启动或登录时下载安装

<TABLE cellspacing ="1" cellpadding ="6" border = "0">
  <TR>
    <TH class="Title" align="center" width=auto>程序</TH>
    <TH class="Title" align="center" width=auto>更新日期</TH>
    <TH class="Title" align="center" width=auto>版本</TH>
    <TH class="Title" align="center" width=auto>说明</TH>
    <TH class="Title" align="center" width=auto>链接</TH>
  </TR>
  <TR>
    <TD class="Item" align="center">VC++ 2015-2022</TD>
    <TD class="Item" align="center">2022/10/23</TD>
    <TD class="Item" align="center">x64</TD>
    <TD class="Item">安装 VC++ 运行库修复启动错误</TD>
    <TD class="Item" align="center">
      <script type="text/javascript">
        var git_url="{{ site.fastgit_url }}";
        document.write("<a href=\""+git_url+"/VC_redist_2015-2022.x64.exe\">下载</a>");
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
        var git_url="{{ site.fastgit_url }}";
        document.write("<a href=\""+git_url+"/VC_redist_2015-2022.x86.exe\">下载</a>");
      </script>
    </TD>
  </TR>
  <TR>
    <TD class="Item" align="center">.NET Framework</TD>
    <TD class="Item" align="center">2024/07/09</TD>
    <TD class="Item" align="center">v8.0.7</TD>
    <TD class="Item">安装 .NET 组件修复启动闪退</TD>
    <TD class="Item" align="center">
      <script type="text/javascript">
        var git_url="{{ site.fastgit_url }}";
        document.write("<a href=\""+git_url+"/dotnet-runtime-8.0.7-win-x64.exe\">下载</a>");
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
        var git_url="{{ site.fastgit_url }}";
        document.write("<a href=\""+git_url+"/Win32OpenSSL_Light-1_1_1u.exe\">下载</a>");
      </script>
    </TD>
  </TR>
</TABLE>