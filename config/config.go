package config

import (
	"encoding/json"
	"os"

	"github.com/madsbyriel/gfac"
)

type config_vals struct {
    DelayPerCharacter int `json:"delay_per_character"`
    Triggers []Trigger `json:"triggers"`
}

type Trigger struct {
    Trigger []string `json:"trigger"`
    Output string `json:"output"`
}

type IConfig interface {
    GetDelayPerCharacter() int
    GetTriggers() []Trigger
}

func (c *config_vals) Init() *config_vals {
    bytes, err := os.ReadFile("configuration.json")

    if err != nil {
        panic(err)
    }

    var jsonData config_vals
    err = json.Unmarshal(bytes, &jsonData)
    if err != nil {
        panic(err)
    }

    return &jsonData
}

func (c *config_vals) GetDelayPerCharacter() int {
    return c.DelayPerCharacter
}

func (c *config_vals) GetTriggers() []Trigger {
    return c.Triggers
}

func RegisterConfig(c *gfac.Container) {
    c.Register(&config_vals{}, (*IConfig)(nil))
}
