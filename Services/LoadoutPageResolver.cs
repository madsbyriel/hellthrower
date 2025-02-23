using Autofac;
using HellthrowerWPF.Pages;

namespace HellthrowerWPF.Services;

public class LoadoutPageResolver : ILoadoutPageResolver
{
    private readonly ILifetimeScope _lifetimeScope;
    private readonly IConfigService _configService;

    public LoadoutPageResolver(ILifetimeScope lifetimeScope, IConfigService configService)
    {
        _lifetimeScope = lifetimeScope;
        _configService = configService;
    }
    
    private readonly Dictionary<string, LoadoutPage> _loadoutPages = new ();

    public LoadoutPage? ResolveFromTag(object tagObject)
    {
        if (tagObject is not string tag || !tag.StartsWith("Loadout_")) return null;
        var name = tag.Split("Loadout_")[1];
        
        var loadout = _configService.GetConfigModel().Loadouts.FirstOrDefault(x => x.Name == name);
        if (loadout == null) return null;

        if (_loadoutPages.TryGetValue(name, out var loadoutPage)) return loadoutPage;
        
        loadoutPage = new LoadoutPage(loadout, _lifetimeScope.Resolve<LoadoutPageArgs>());
        _loadoutPages.Add(name, loadoutPage);
        return loadoutPage;
    }
}