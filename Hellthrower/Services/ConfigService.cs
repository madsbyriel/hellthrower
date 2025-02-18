using System;
using System.Collections.Generic;
using System.IO;
using Windows.System;
using Hellthrower.Extensions;
using Newtonsoft.Json;
using Hellthrower.Models;
using Microsoft.UI.Input;

namespace Hellthrower.Services;

public class ConfigService : IConfigService
{
    private readonly ConfigModel _config;
    private readonly string _fileName;
    
    public ConfigService()
    {
        var appdata = Environment.GetEnvironmentVariable("APPDATA");
        if (appdata == null)
            throw new Exception("Did not find environment variable: APPDATA");
        _fileName = $"{appdata}\\Hellthrower\\config.json";

        if (!File.Exists(_fileName))
        {
            var split = _fileName.Split('\\');
            var dirpath = "";
            for (int i = 0; i < split.Length - 1; i++)
            {
                dirpath += $"{split[i]}\\";
            }
            
            Directory.CreateDirectory(dirpath);
            File.Create(_fileName).Close();
        }

        string configFile = File.ReadAllText(_fileName);
        var model = JsonConvert.DeserializeObject<ConfigModel>(configFile);

        if (model is null)
        {
            _config = new ConfigModel();
        }
        else
        {
            _config = model;
        }
    }
    
    public ConfigModel GetConfigModel() => _config;

    public void Save()
    {
        File.WriteAllText(_fileName, JsonConvert.SerializeObject(_config, Formatting.Indented));
    }
    
    private class ConfigModelJson(List<LoadoutJson> loadouts)
    {
        public List<LoadoutJson> Loadouts { get; set; } = loadouts;
    }

    private class LoadoutJson(string name, List<StratagemBindingJson> stratagemBindings)
    {
        public string Name { get; set; } = name;
        public List<StratagemBindingJson> StratagemBindings { get; set; } = stratagemBindings;
    }

    private class StratagemBindingJson(List<TriggerJson> keys)
    {
        public List<TriggerJson> Keys { get; set; } = keys;
    }
    
    private class TriggerJson(int key)
    {
        public int Key { get; set; } = key;
    }
}