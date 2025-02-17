using System;
using System.Collections.Generic;
using System.Linq;
using Autofac;
using Hellthrower.Models;
using Hellthrower.Pages;
using Microsoft.UI.Xaml.Controls;

namespace Hellthrower.Services;

public class ViewLoadoutPageResolver : IViewLoadoutPageResolver
{
    private readonly IConfigService _configService;
    private readonly ILifetimeScope _lifetimeScope;
    private readonly Dictionary<string, Page> _pages = new Dictionary<string, Page>();

    public ViewLoadoutPageResolver(IConfigService configService, ILifetimeScope lifetimeScope)
    {
        _configService = configService;
        _lifetimeScope = lifetimeScope;
    }
    
    public Page ResolveLoadoutPage(Loadout loadout)
    {
        var l = _configService.GetConfigModel().Loadouts.FirstOrDefault(x => x.Name == loadout.Name);
        if (l == null)
            throw new Exception("Loadout not found");

        if (!_pages.TryGetValue(l.Name, out var page))
        {
            _pages[l.Name] = new ViewLoadoutPage(loadout, _lifetimeScope.Resolve<ViewLoadoutPageCtor>());
            page = _pages[l.Name];
        }

        return page;
    }
}