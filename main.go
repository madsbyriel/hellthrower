package main

import (
	"github.com/madsbyriel/gfac"
	"github.com/madsbyriel/hellthrower/config"
	"github.com/madsbyriel/hellthrower/eventprocessor"
)

func main() {
    container := (&gfac.Container{}).Init()

    config.RegisterConfig(container)
    eventprocessor.RegisterEventProcessor(container)

    _ = container.Resolve((*eventprocessor.IEventProcessor)(nil))
}
