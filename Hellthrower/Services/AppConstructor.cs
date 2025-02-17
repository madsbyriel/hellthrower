using Autofac;
using Gma.System.MouseKeyHook;
using Hellthrower.Pages;
using Hellthrower.ViewModels;
using WinRT;

namespace Hellthrower.Services;

public class AppConstructor : IAppConstructor
{
    public IContainer Construct()
    {
        var builder = new ContainerBuilder();
        
        builder.RegisterType<ConfigService>().As<IConfigService>().SingleInstance();
        
        builder.RegisterType<MainWindowVM>().SingleInstance();
        builder.RegisterType<RunningPageVM>().SingleInstance();
        builder.RegisterType<CreateLoadoutPageVM>().SingleInstance();
        builder.RegisterType<KeyHooker>().As<IKeyHooker>().SingleInstance();
        
        builder.RegisterType<MainWindow>().SingleInstance();
        builder.RegisterType<RunningPage>().SingleInstance();
        builder.RegisterType<CreateLoadoutPage>().SingleInstance();
        builder.RegisterType<ViewLoadoutPageCtor>().SingleInstance();
        
        builder.RegisterType<ViewLoadoutPageResolver>().As<IViewLoadoutPageResolver>().SingleInstance();
        builder.Register<IKeyboardMouseEvents>(_ => Hook.GlobalEvents()).SingleInstance();
        
        return builder.Build();
    }
}