"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface EmailConfig {
  host: string;
  port: string;
  user: string;
  password: string;
  from: string;
}

export default function ConfigPage() {
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    host: '',
    port: '465',
    user: '',
    password: '',
    from: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await api.get('/api/config');
        if (response.data.success && response.data.config.email) {
          setEmailConfig(response.data.config.email);
        }
      } catch (error) {
        console.error('加载配置失败:', error);
        toast.error('加载配置失败');
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  const handleSave = async () => {
    if (!emailConfig.host || !emailConfig.port || !emailConfig.user || !emailConfig.password) {
      toast.error('请填写所有必填字段');
      return;
    }

    setIsSaving(true);
    try {
      await api.post('/api/config', { email: emailConfig });
      toast.success('配置保存成功');
    } catch (error) {
      console.error('保存配置失败:', error);
      toast.error('保存配置失败');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">系统配置</h1>

        <Card>
          <CardHeader>
            <CardTitle>邮件服务器配置</CardTitle>
            <CardDescription>
              配置邮件服务器用于发送Offer邮件。请确保您的邮件服务器支持SMTP协议。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="host">SMTP服务器地址 *</Label>
              <Input
                id="host"
                value={emailConfig.host}
                onChange={(e) => setEmailConfig({ ...emailConfig, host: e.target.value })}
                placeholder="例如: smtp.qq.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="port">SMTP端口 *</Label>
              <Input
                id="port"
                type="number"
                value={emailConfig.port}
                onChange={(e) => setEmailConfig({ ...emailConfig, port: e.target.value })}
                placeholder="例如: 465 (SSL) 或 587 (TLS)"
              />
              <p className="text-sm text-muted-foreground">
                常用端口：465 (SSL)、587 (TLS)、25 (非加密)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user">邮箱账号 *</Label>
              <Input
                id="user"
                type="email"
                value={emailConfig.user}
                onChange={(e) => setEmailConfig({ ...emailConfig, user: e.target.value })}
                placeholder="例如: yourname@qq.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">邮箱密码/授权码 *</Label>
              <Input
                id="password"
                type="password"
                value={emailConfig.password}
                onChange={(e) => setEmailConfig({ ...emailConfig, password: e.target.value })}
                placeholder="请输入邮箱密码或授权码"
              />
              <p className="text-sm text-muted-foreground">
                注意：部分邮箱需要使用授权码而非密码，请在邮箱设置中获取
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="from">发件人名称（可选）</Label>
              <Input
                id="from"
                value={emailConfig.from}
                onChange={(e) => setEmailConfig({ ...emailConfig, from: e.target.value })}
                placeholder="例如: 武汉风行在线技术有限公司"
              />
            </div>

            <div className="pt-4">
              <Button onClick={handleSave} disabled={isSaving} className="w-full">
                {isSaving ? '保存中...' : '保存配置'}
              </Button>
            </div>

            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">常见邮箱配置参考：</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>QQ邮箱：</strong>smtp.qq.com，端口465，需使用授权码
                </div>
                <div>
                  <strong>163邮箱：</strong>smtp.163.com，端口465，需使用授权码
                </div>
                <div>
                  <strong>Gmail：</strong>smtp.gmail.com，端口587，需开启"不太安全的应用访问"或使用应用专用密码
                </div>
                <div>
                  <strong>企业邮箱：</strong>请咨询您的IT部门获取SMTP配置信息
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}