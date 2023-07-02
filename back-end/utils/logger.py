
class Logger:
   
    colors = {
        'error': '\033[91m',     # red color
        'warning': '\033[93m',   # yellow color
        'info': '\033[94m',       # blue color
        'debug': '\033[94m'       # blue color
    }
    end_color = '\033[0m'   # reset color
    is_debug = False
    
    @classmethod
    def debug(cls, *messages):
        if not cls.is_debug: 
            return 
        
        level = "debug"
        color = cls.colors[level]
        formatted_messages = ' '.join(str(message) for message in messages)
        log_message = f"{color}[{level.upper()}]{cls.end_color} {formatted_messages}"
        print(log_message)
    
    @classmethod
    def info(cls, *messages):
        level = "info"
        color = cls.colors[level]
        formatted_messages = ' '.join(str(message) for message in messages)
        log_message = f"{color}[{level.upper()}]{cls.end_color} {formatted_messages}"
        print(log_message)
    
    
    @classmethod
    def warn(cls, *messages):
        level = "warning"
        color = cls.colors[level]
        formatted_messages = ' '.join(str(message) for message in messages)
        log_message = f"{color}[{level.upper()}]{cls.end_color} {formatted_messages}"
        print(log_message)
    
    
    @classmethod
    def error(cls, *messages):
        level = "error"
        color = cls.colors[level]
        formatted_messages = ' '.join(str(message) for message in messages)
        log_message = f"{color}[{level.upper()}]{cls.end_color} {formatted_messages}"
        print(log_message)