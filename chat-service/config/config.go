package config

import (
	"errors"
	"os"
)

func GetEnv(key string) (string, error) {
	val := os.Getenv(key)
	if val == "" {
		return "", errors.New("environment variable not found")
	}
	return val, nil
}
