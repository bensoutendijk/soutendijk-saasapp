module ApplicationHelper
end
def flash_class(level)
    case level
        when 'notice' then "container alert alert-dismissable alert-info"
        when 'success' then "container alert alert-dismissable alert-success"
        when 'error' then "container alert alert-dismissable alert-danger"
        when 'alert' then "container alert alert-dismissable alert-danger"
    end
end
