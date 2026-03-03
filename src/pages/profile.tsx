import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar";
import {
    Badge,
} from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

import {
    Camera,
    Edit,
    Shield,
    Star,
    Lock,
    MapPin,
    Bell,
    Globe,
    Settings,
    User,
    Heart,
    MessageSquare,
    ChevronRight,
    LogOut,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState(true);
    const [publicProfile, setPublicProfile] = useState(true);

    return (
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 pb-6 space-y-6">

            {/* ================= PROFILE CARD ================= */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-4">

                        {/* Avatar */}
                        <div className="relative">
                            <Avatar className="w-24 h-24">
                                <AvatarFallback className="text-2xl">
                                    D
                                </AvatarFallback>
                            </Avatar>

                            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Nome + Email */}
                        <div className="text-center space-y-1">
                            <h2 className="font-semibold flex items-center gap-2 justify-center">
                                Usuário
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="w-6 h-6"
                                >
                                    <Edit className="w-3 h-3" />
                                </Button>
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                demo@google.com
                            </p>

                            <Badge variant="secondary" className="mt-2">
                                <Shield className="w-3 h-3 mr-1" />
                                Membro Verificado
                            </Badge>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-4 w-full mt-6 text-center">
                            <div>
                                <div className="font-semibold text-lg">47</div>
                                <div className="text-xs text-muted-foreground">
                                    Visitados
                                </div>
                            </div>

                            <div>
                                <div className="font-semibold text-lg">23</div>
                                <div className="text-xs text-muted-foreground">
                                    Favoritos
                                </div>
                            </div>

                            <div>
                                <div className="font-semibold text-lg">15</div>
                                <div className="text-xs text-muted-foreground">
                                    Reviews
                                </div>
                            </div>

                            <div>
                                <div className="font-semibold text-lg flex items-center justify-center gap-1">
                                    <Star className="w-4 h-4 fill-warning text-warning" />
                                    4.8
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Avaliação
                                </div>
                            </div>
                        </div>

                    </div>
                </CardContent>
            </Card>

            {/* ================= PRIVACIDADE ================= */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Permissões e Privacidade
                    </CardTitle>
                    <CardDescription>
                        Gerencie como o LOCATIVE usa suas informações
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">

                    {/* Localização */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 font-medium">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                Localização
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Recomendações baseadas na sua localização
                            </div>
                        </div>
                        <Switch />
                    </div>

                    <Separator />

                    {/* Notificações */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 font-medium">
                                <Bell className="w-4 h-4 text-muted-foreground" />
                                Notificações
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Receba alertas sobre lugares e eventos próximos
                            </div>
                        </div>

                        <Switch
                            checked={notifications}
                            onCheckedChange={setNotifications}
                        />
                    </div>

                    {/* Sub-opções */}
                    {notifications && (
                        <div className="ml-6 space-y-4 pl-4 border-l-2 border-muted">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium">
                                        Push Notifications
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Notificações no dispositivo
                                    </div>
                                </div>
                                <Switch />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium">Email</div>
                                    <div className="text-xs text-muted-foreground">
                                        Newsletter e atualizações
                                    </div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Perfil Público */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 font-medium">
                                <Globe className="w-4 h-4 text-muted-foreground" />
                                Perfil Público
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Outros usuários podem ver seu perfil
                            </div>
                        </div>

                        <Switch
                            checked={publicProfile}
                            onCheckedChange={setPublicProfile}
                        />
                    </div>

                    {/* Sub-opções */}
                    {publicProfile && (
                        <div className="ml-6 space-y-4 pl-4 border-l-2 border-muted">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium">
                                        Mostrar Favoritos
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Seus lugares favoritos serão visíveis
                                    </div>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium">
                                        Mostrar Reviews
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Suas avaliações serão públicas
                                    </div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </div>
                    )}


                </CardContent>
            </Card>

            {/* ================= CONFIGURAÇÕES ================= */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Configurações
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">

                    <Button variant="ghost" className="w-full justify-between">
                        <span className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Editar Perfil
                        </span>
                        <ChevronRight className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full justify-between"
                        onClick={() => navigate("/favorites")}
                    >
                        <span className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            Meus Favoritos
                        </span>
                        <ChevronRight className="w-4 h-4" />
                    </Button>

                    <Button variant="ghost" className="w-full justify-between">
                        <span className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Minhas Reviews
                        </span>
                        <ChevronRight className="w-4 h-4" />
                    </Button>

                    <Button variant="ghost" className="w-full justify-between">
                        <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Lugares Visitados
                        </span>
                        <ChevronRight className="w-4 h-4" />
                    </Button>

                </CardContent>
            </Card>

            <Card className="border-info bg-info/5">
                <CardContent className="pt-6">
                    <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                            <Shield className="w-4 h-4 text-info-foreground mt-0.5" />

                            <div>
                                <div className="font-medium text-info-foreground">
                                    Compromisso com sua Privacidade
                                </div>

                                <p className="text-info-foreground/80 mt-1">
                                    O LOCATIVE segue as melhores práticas de privacidade e está em
                                    conformidade com WCAG 2.1 AA. Seus dados são criptografados e
                                    nunca compartilhados sem seu consentimento explícito.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ================= LOGOUT ================= */}
            <Button variant="destructive" className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Sair da Conta
            </Button>

        </div>
    );
}
