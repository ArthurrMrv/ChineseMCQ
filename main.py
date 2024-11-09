from unidecode import unidecode
import json
from colorama import init as colorama_init
from colorama import Fore
from colorama import Style
import os
import sys
import random

def main():
    
    colorama_init()
    
    file_path = check_params()
    
    words = random.sample(json.load(open(file_path)), int(sys.argv[1]))

    good = game_loop(words)
    
    print_results(good, len(words))
    

def check_params(file_path = "words.json"):
    if not sys.argv[1].isnumeric():
        raise ValueError(f"{Fore.RED}The number of words must be a number{Style.RESET_ALL}")
    
    if len(sys.argv) < 2:
        raise ValueError(f"{Fore.RED}You must provide the number of words to generate{Style.RESET_ALL}")
    
    if len(sys.argv) > 2:
        file_path = sys.argv[2] 
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"{Fore.RED}File {file_path} not found{Style.RESET_ALL}")
    
    return file_path

def game_loop(words :list,
              good : int = 0):
    
    for i, word in enumerate(words):
        
        question, answer = (word["ch"], word["fr"]) if random.choice([True, False]) else (word["fr"], word["ch"])
        
        print(f"({i}/{len(words)}) {Style.BRIGHT}{question}{Style.RESET_ALL}")
        ans = input("Enter the french translation: ")
        
        if unidecode(ans).lower() == unidecode(answer).lower():
            good += 1
            print(f"{Fore.GREEN}--- YE{'S'*good} ({answer}) ---{Style.RESET_ALL}")
        else:
            print(f"{Fore.YELLOW}--- {question} : {answer} ---{Style.RESET_ALL}")
    
    return good

def print_results(good : int, 
                  total: int):
    
    if good/total >= 0.75:
        print(f"{Fore.GREEN}--- {good}/{total}{Style.RESET_ALL} ---")
    elif good/total >= 0.5:
        print(f"{Fore.YELLOW}--- {good}/{total}{Style.RESET_ALL} ---")
    else:
        print(f"{Fore.RED}--- {good}/{total}{Style.RESET_ALL} ---")
        
    return good/total

if __name__ == '__main__':
    main()