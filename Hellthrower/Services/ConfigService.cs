using System;
using System.Collections.Generic;
using System.IO;
using Hellthrower.Extensions;
using Newtonsoft.Json;
using Hellthrower.Models;

namespace Hellthrower.Services;

public class ConfigService : IConfigService
{
    private readonly ConfigModel _config;
    
    public ConfigService()
    {
        var appdata = Environment.GetEnvironmentVariable("APPDATA");
        if (appdata == null)
            throw new Exception("Did not find environment variable: APPDATA");

        _config = new();
        
        string dirPath = $"{appdata}\\Hellthrower";
        string path = $"{dirPath}\\config.json";
        if (!File.Exists(path))
        {
            Directory.CreateDirectory(dirPath);
            File.Create(path).Close();
        }

        string configFile = File.ReadAllText(path);
        var model = JsonConvert.DeserializeObject<ConfigModelJson>(configFile);

        if (model is not null)
        {
            _config.Loadouts = model.Loadouts.Map(item =>
                {
                    return new Loadout
                    {
                        Name = item.Name,
                        Keys = item.Keys.ToObservableCollection(),
                        Stratagem = (EStratagem)item.Stratagem,
                    };
                }).ToObservableCollection();
        }
    }
    
    public ConfigModel GetConfigModel() => _config;

    public void Save()
    {
        throw new System.NotImplementedException();
    }
    
    private class ConfigModelJson
    {
        public List<LoadOutJson> Loadouts { get; set; }
    }

    private class LoadOutJson
    {
        public string Name { get; set; }
        public int Stratagem { get; set; }
        public List<int> Keys { get; set; }
    }
}