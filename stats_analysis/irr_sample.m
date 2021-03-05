%% Sampling IRR code
%  Test the effect of sample size on IRR calculation

clear;
close all;
clc;

load('datafile.mat')   %load data

%  m is the number of random samples to do
%  n is the size of each random sample
m = 50;
n = 10;

[kappa_eng,kappa_eng_overall,kappa_eng_mean] = randomize_irr(eng,m,n);
[kappa_comm,kappa_comm_overall,kappa_comm_mean] = randomize_irr(comm,m,n);

%% Plot histograms
%  Overall IRR of the whole dataset is red
%  Mean IRR calculated from m random samples of size n is in green

figure(1);
hold on;
histogram(kappa_eng);
xline(kappa_eng_overall,'r','LineWidth',2);
xline(kappa_eng_mean,'g','LineWidth',2);
set(gca,'fontsize',16) 
title("IRR for "+m+" samples of "+n+" engine scores")

figure(2);
hold on;
histogram(kappa_comm);
xline(kappa_comm_overall,'r','LineWidth',2);
xline(kappa_comm_mean,'g','LineWidth',2);
set(gca,'fontsize',16) 
title("IRR for "+m+" samples of "+n+" comms scores")

%% Display kappa values

kappa_eng_overall
kappa_eng_mean
kappa_comm_overall
kappa_comm_mean


%% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%  Functions go here
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%% Function to calculate the IRR itself
function [kappa,kappa_overall,kappa_mean] = randomize_irr(data,m,n)

    % Get sample means
    data_means = [
        mean(data(~isnan(data(:,1)),1)) ...
        mean(data(~isnan(data(:,2)),2))
    ];

    % Filter out NaNs
    data(any(isnan(data),2),:) = [];
    
    % Calculate the overall IRR for the dataset
    kappa_overall = calcIRR(data,data_means);
    
    % Run a loop for m random samples of size n
    for j=1:m
        kappa(j) = calcIRR(randomize(data,n),data_means);
    end

    % Calculate the mean IRR of all the random samples
    kappa_mean = mean(kappa);
    
end

%% Function to give n random pairs of values
function theVals = randomize(data,num)
    
    % Return the original data if desired number of vals < data length
    if num > length(data)
        theVals = data;
        return;
    end

    % Get (n=num) random integers
    whichInts = randperm(length(data),num);
    
    % Return size (n=num) subset of the data
    for i=1:num
        theVals(i,:) = data(whichInts(i),:);
    end
    
end

%% Calculate IRR function returns the IRR value
function kappa = calcIRR(data,means)

    % 4 categories
    cat1 = 0;
    cat2 = 0;
    cat3 = 0;
    cat4 = 0;
    
    % How many data is there?
    n = length(data);
    
    % Loop over each pair of data and sort
    for i=1:n
        
        current = data(i,:);
        
        if current(1) < means(1) && current(2) < means(2)
            cat1 = cat1 + 1;
            
        elseif current(1) < means(1) && current(2) >= means(2)
            cat2 = cat2 + 1;
            
        elseif current(1) >= means(1) && current(2) < means(2)
            cat3 = cat3 + 1;
            
        elseif current(1) >= means(1) && current(2) >= means(2)
            cat4 = cat4 + 1;
            
        else
            % display error if cannot sort
            disp("Error in counting")
        end
        
    end
    
    % Calculate p0 and pe
    p0 = (cat1+cat4)/n;
    pe = ((cat1+cat3)/n)*((cat1+cat2)/n) + ((cat2+cat4)/n)*((cat3+cat4)/n);
    
    % Calculate kappa
    kappa = (p0-pe)/(1-pe);

end
