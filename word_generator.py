import json
from colorama import init as colorama_init
from colorama import Fore
from colorama import Style

import os

def main():
    words = list()
    
    colorama_init()


    it = 1_000_000
    while it:
        it -= 1
        ch = input("Enter chinese word: ").strip()
        
        if len(ch) == 0:
            break
        
        fr = input("Enter french translation: ").strip()
        
        if len(fr) == 0:
            print(f"--- {Fore.RED}Translation is empty{Style.RESET_ALL} ---")
            continue
        
        words = list(filter(lambda x: x["ch"] != ch, words))
        
        words.append({"ch": ch, "fr": fr})
        
        print(f"--- {Fore.GREEN}{ch} : {fr}{Style.RESET_ALL} added ---")
        
    name_save = input("Enter the name of the file to save: ")
    
    if os.path.exists(f"{name_save}.json"):
        sure = input(f"File {name_save} already exists, do you want to overwrite it? (y/n) ")
        if sure.lower() != "y":
            print("File not saved")
            return
        
        sure = input("Do you want to append to it or overwrite it (a/o)? ")
        if sure.lower() == "a":
            words_saved = json.load(open(f"{name_save}.json"))
            fr = list(map(lambda x: x["fr"], words_saved))
            ch = list(map(lambda x: x["ch"], words_saved))
            
            words = list(filter(lambda x: x["ch"] not in ch and x["fr"] not in fr, words))
            
            words += words_saved
            
        else:
            ans = input("Are you sure you want to overwrite the file? (y/n) ")
            if ans.lower() != "y":
                print("File not saved")
                return

    json.dump(words, open(f"{name_save}.json", "w"))
    

if __name__ == '__main__':
    main()